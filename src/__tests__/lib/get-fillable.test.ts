import { expect } from 'chai';
import { getFillable } from '../../lib/get-fillable';

describe('getFillable', () => {
    it('should filter object if sent', () => {
        const raw = {
            name: 'Bob',
            color: 'Green',
            height: 'tall'
        };
        const fillable = ['name', 'height'];
        const record = getFillable(raw, fillable);

        expect(record).to.deep.equal({
            name: 'Bob',
            height: 'tall'
        });
    });

    it('should filter object if sent empty list', () => {
        const raw = {
            name: 'Bob',
            color: 'Green',
            height: 'tall'
        };
        const record = getFillable(raw, []);

        expect(record).to.deep.equal({
            name: 'Bob',
            height: 'tall',
            color: 'Green'
        });
    });

    it('should filter object if sent null list', () => {
        const raw = {
            name: 'Bob',
            color: 'Green',
            height: 'tall'
        };
        const record = getFillable(raw, null);

        expect(record).to.deep.equal({
            name: 'Bob',
            height: 'tall',
            color: 'Green'
        });
    });
});
